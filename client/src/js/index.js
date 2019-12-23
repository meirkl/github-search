(function() {
  'use strict';
  const GITHUB_USERS_API_URL = 'https://api.github.com/users/';
  const searchButton = document.querySelector('#btn-search');
  const saveButton = document.querySelector('#btn-save');
  const deleteButton = document.querySelector('#btn-delete');
  const githubUserNameElement = document.querySelector('#user-name');
  const inputErrorAlert = document.querySelector('#input-alert');
  const reposDiv = document.querySelector('#repos-div');

  async function myFetch(url) {
    const res = await fetch(url);
    if (res.status >= 200 && res.status < 400) {
      return await res.json();
    }
    return new Promise(function(_, reject) {
      reject("Couldn't fetch...");
    });
  }

  function showError(error) {
    inputErrorAlert.innerText = error;
    inputErrorAlert.classList.remove('d-none');
  }

  function hideError() {
    if (!inputErrorAlert.classList.contains('d-none')) {
      inputErrorAlert.classList.add('d-none');
      inputErrorAlert.innerText = '';
    }
  }

  function getGithubUserName() {
    return githubUserNameElement.value.trim().toLowerCase();
  }

  function filteredRepos(repos) {
    return repos.map(({ full_name, html_url }) => {
      return { name: full_name, html_url };
    });
  }

  function filteredFollowers(followers) {
    return followers.map(({ login, html_url }) => {
      return { name: login, html_url };
    });
  }

  function createDataList(title, list, error) {
    return `<div><h3>${title}</h3>${
      list.length > 0
        ? `<ol>${list
            .map(({ name, html_url }) => `<li><a href="${html_url}">${name}</a></li>`)
            .join('')}</ol>`
        : `<p class="pl-3">${error}</p>`
    }</div>`;
  }

  function renderResults(userName, reposList, followersList) {
    reposDiv.innerHTML = `<div class="shadow p-3 bg-white rounded flex-fill">
      <div class="alert alert-info flex-fill font-weight-bold">${userName}</div>
      ${createDataList('Repositories', reposList, 'No repositories')}
      ${createDataList('Followers', followersList, 'No followers')}
    </div>`;
    reposDiv.classList.add('d-flex');
    reposDiv.classList.remove('d-none');
  }

  function hideResults() {
    reposDiv.classList.add('d-none');
    reposDiv.classList.remove('d-flex');
    reposDiv.innerHTML = '';
  }

  async function getGitHubUserInfo() {
    const userName = getGithubUserName();
    if (userName) {
      try {
        const { login, public_repos, repos_url, followers, followers_url } = await myFetch(
          GITHUB_USERS_API_URL + userName
        );
        const reposList = await myFetch(repos_url);
        const followersList = await myFetch(followers_url);
        renderResults(login, filteredRepos(reposList), filteredFollowers(followersList));
      } catch (error) {
        console.log(`Error: ${error}`);
        showError(error);
        hideResults();
      }
    }
  }

  (function() {
    githubUserNameElement.addEventListener('click', hideError);
    searchButton.addEventListener('click', getGitHubUserInfo);
  })();
})();
