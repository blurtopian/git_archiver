const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';
const ACCESS_TOKEN = process.env.GIT_ACCESS_TOKEN; // Replace with your actual token
const TEST_KEYWORD = process.env.TEST_KEYWORD; // You can change this to any keyword you like

async function searchRandomRepo() {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/search/repositories`,
      {
        headers: {
          Authorization: `token ${ACCESS_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          q: TEST_KEYWORD,
          sort: 'stars',
          order: 'desc'
        }
      },
    );

    if (response.status != 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = response.data;

    if (data.items && data.items.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const randomRepo = data.items[randomIndex];
      return randomRepo;
    } else {
      console.log('No repositories found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = {
  searchRandomRepo,
};
