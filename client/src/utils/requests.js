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

export const getPostsFromLastTwoDays = async (timeframeNumber, timeframeUnits, setPosts) => {
  const startDate = new Date(new Date().valueOf() - 1000 * 60 * (timeframeUnits === 'h' ? 60 : 60 * 24) * timeframeNumber);
  const response = await fetch(`${host}/api/v1/posts?startDate=${getFormattedDateTime(startDate)}`);
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
