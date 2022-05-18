const axios = require("axios");

const SLACK_URL =
  "https://hooks.slack.com/services/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";

const generateMarkdownSection = ([name, value]) => ({
  text: {
    text: `${name}: *${value}*`,
    type: "mrkdwn",
  },
  type: "section",
});

const generateAttachment = ({client, meta = []}) => {
  return [
    {
      blocks: [
        {
          text: {
            emoji: true,
            text: `Successfully built ${client} catering`,
            type: "plain_text",
          },
          type: "header",
        },
        ...Object.entries(meta).map(generateMarkdownSection),
      ],
      color: "#36a64f",
    },
  ];
};

module.exports = async ({client, environment, branch, user}) => {
  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const attachments = generateAttachment({
    client,
    meta: {
      Branch: branch,
      Date: formattedDate,
      Environment: environment,
      User: user,
    },
  });
  const axiosOptions = {
    data: {
      attachments,
    },
    method: "POST",
    url: SLACK_URL,
  };

  return axios(axiosOptions);
};
