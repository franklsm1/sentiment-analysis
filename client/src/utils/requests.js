const host = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export const getKeywords = async (setKeywords) => {
  const response = await fetch(`${host}/api/v1/keywords`);
  const body = await response.json();

  if (response.status !== 200) {
    return console.log(body.message);
  }

  setKeywords(body);
};

const getFormattedDateTime = (date) =>
  date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

export const getPostsFromLastTwoDays = async (startDate, endDate, setPosts) => {
  const response = await fetch(`${host}/api/v1/posts?startDate=${getFormattedDateTime(startDate)}&endDate=${getFormattedDateTime(endDate)}`);
  const body = await response.json();

  if (response.status !== 200) {
    return console.log(body.message);
  }

  let posts = { negative: [], neutral: [], positive: [] };
  posts = body.reduce((reduced, post) => {
    if (post.sentiment < -2) {
      reduced.negative.push(post);
    } else if (post.sentiment > 2) {
      reduced.positive.push(post);
    } else {
      reduced.neutral.push(post);
    }
    return reduced;
  }, posts);

  setPosts(posts);
};
