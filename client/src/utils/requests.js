const host = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export const getKeywords = async (setKeywords) => {
  const response = await fetch(`${host}/api/v1/keywords`);
  const body = await response.json();

  if (response.status !== 200) {
    return console.log(body.message);
  }

  setKeywords(body);
};

export const getPostsFromLastTwoDays = async (setPosts) => {
  const today = new Date();
  const todaysDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const response = await fetch(`${host}/api/v1/posts?startDate=${todaysDate}`);
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
