const fetch = require('node-fetch');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token
const TEST_KEYWORD = process.env.TEST_KEYWORD; // You can change this to any keyword you like

async function fetchGitHubData() {
  const response = await fetch(`${GITHUB_API_URL}/user`, {
    headers: {
      Authorization: `token ${ACCESS_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  const data = await response.json();
  console.log(data);
}

async function searchRandomRepo() {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/search/repositories?q=${TEST_KEYWORD}`,
      {
        headers: {
          Authorization: `token ${ACCESS_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const randomRepo = data.items[randomIndex];
      console.log('Random Repository:', randomRepo);
    } else {
      console.log('No repositories found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  fetchGitHubData,
  searchRandomRepo,
};
