# Blog Talk
a minimally designed and dynamically built blog hosting site

![blogtalk](public/readme/bt.png)

# technologies 
**next.js** <br>
**sanity.io**<br>
**tailwind css**

# The Meat & Potatoes

the real meat and potatoes is in the [slug.tsx] file<br>

this is telling next.js what posts already exist so it can prebuild our pages by using ```getStaticProps()```

```
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments' : *[_type == "comment" &&
          post._ref == ^._id &&
          approved== true],
        description,
        mainImage,
        slug,
        body
    }`;

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 60,
    }
}
```
now when next.js trys to prepare a page it has to know which slug or id to grab in order to prepare a post

```
export const getStaticPaths =async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
             current
            }
      }`;

      const posts = await sanityClient.fetch(query);

      const paths = posts.map((post: Post) => ({
          params: {
              slug: post.slug.current
          }
      }))

      return {
          paths,
          fallback: 'blocking'
      };
};
```
in the first photo we also used:<br>

```
return {
        props: {
            post,
        },
        revalidate: 60,
    }
```

this enables ISR and says after 60 seconds we'll update the old cache.

you can read about ISR further here: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration