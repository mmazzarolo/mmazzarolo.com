module.exports = {
  siteMetadata: {
    title: `mmazzarolo.com`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@mmazzarolo`,
    siteUrl: `https://gatsby-starter-blog-demo.netlify.com/`,
    social: {
      twitter: `mmazzarolo`
    },
    menuLinks: [
      { name: "About", link: "/" },
      { name: "Blog", link: "/blog" },
      { name: "Reviews", link: "/reviews" }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              showCaptions: true,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          `@raae/gatsby-remark-oembed`,
          `gatsby-remark-embed-gist`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    {
      resolve: "gatsby-plugin-node-fields",
      options: {
        descriptors: [
          {
            predicate: node => node.internal.type === `MarkdownRemark`,
            fields: [
              {
                name: "director",
                getter: node => node.frontmatter.director,
                defaultValue: ""
              },
              {
                name: "season",
                getter: node => node.frontmatter.season,
                defaultValue: ""
              }
            ]
          }
        ]
      }
    },
    "gatsby-redirect-from",
    "gatsby-plugin-meta-redirect",
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`
      }
    },
    { resolve: `gatsby-plugin-styled-components`, options: { display: true } }
  ]
};
