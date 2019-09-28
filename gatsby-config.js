module.exports = {
  siteMetadata: {
    title: `mmazzarolo.com`,
    titleTemplate: "%s · mmazzarolo.com",
    description: `Personal blog by Matteo. Tech, code, dumb stuff.`,
    siteUrl: `https://mmazzarolo.com/`,
    twitterUsername: `@mmazzarolo`,
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
              },
              {
                name: "artist",
                getter: node => node.frontmatter.artist,
                defaultValue: ""
              },
              {
                name: "author",
                getter: node => node.frontmatter.author,
                defaultValue: ""
              }
            ]
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { fileAbsolutePath: { regex: "/blog/" } }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "blog/index.xml",
            title: "mmazzarolo.com blog",
            match: "/blog/"
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
