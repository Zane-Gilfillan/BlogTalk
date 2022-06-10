import Header from '../../components/Header'
import { GetStaticProps } from 'next';
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react';
import PortableText from 'react-portable-text'

interface iFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}

function Post({post}: Props) {
    
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: {errors}, } = useForm<iFormInput>();

    const onSubmit: SubmitHandler<iFormInput> = async(data) => {
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(() => {
            setSubmitted(true);

        }).catch((err) => {
            console.log(err);
            setSubmitted(false);
        });
    }

  return (
    <main>
        <Header />
        <img className='w-full h-40 object-cover' src={urlFor(post.mainImage).url()!} alt="" />

        <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
                <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()!} alt="" />
                <p className='font-extralight text-sm'> article by <span className='text-blue-600'>{post.author.name}</span> published at {new Date(post._createdAt).toLocaleString()}</p>
            </div>

            <div className='mt-10'>
                <PortableText dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!} 
                projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                content={post.body}
                serializers={{
                h1:(props : any) => (
                <h1 className='text-2xl font-bold my-5' {...props} /> 
                ),
                h2:(props : any) => (
                <h2 className='text-xl font-bold my-5' {...props} />
                ),
                li:({children} : any) => (
                <li className='ml-4 list-disc'> {children}</li>
            ),
            link:({href, children}: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                {children}
                </a>
            ),
            }}
           />
            </div>
        </article>

        <hr className='max-w-lg my-5 mx-auto border border-blue-500' />

        {submitted ? (
            <div className='flex flex-col p-10 my-10 bg-blue-500 text-white max-w-2xl mx-auto'>
                <h3 className='text-3xl mx-3 font-bold'>thanks for the comment</h3>
                <p className='mx-3'>
                    once your comment has been approved by a moderator, it will appear bellow
                </p>
            </div>
        ): (
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mx-auto'>
                <h3 className='text-sm text-blue-500'>enjoyed the article?</h3>
                <h4 className='text-3xl font-bold'>leave a comment below</h4>
                <hr className='py-3 mt-2' />

                <input
                    {...register('_id')}
                    type="hidden"
                    name='_id'
                    value={post._id}
                />

                <label className='block mb-5'>
                    <span className='text-gray-700'>name</span>
                    <input
                        {...register('name', {required: true})}
                        className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-blue-500 outline-none focus:ring' placeholder='john appleseed' type="text"
                    />
                </label>
                <label className='block mb-5'>
                    <span className='text-gray-700'>email</span>
                    <input
                        {...register('email', {required: true})}
                        className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-blue-500 outline-none focus:ring' placeholder='johnappleseed@email.com' type="text"
                        />
                </label>
                <label className='block mb-5'>
                    <span className='text-gray-700'>comment</span>
                    <textarea
                        {...register('comment', {required: true})}
                        className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-blue-500 outline-none focus:ring' placeholder='be kind' rows={8} 
                    />
                </label>

                <div className='flex flex-col p-5'>
                    {errors.name && (
                        <span className='text-red-500'>name is required</span>
                    )}
                    {errors.email && (
                        <span className='text-red-500'>email is required</span>
                    )}
                    {errors.comment && (
                        <span className='text-red-500'>comment is required</span>
                    )}
                </div>
                <input type="submit" className='shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text white font-bold py-2 px-4 rounded cursor-pointer' />
            </form>
        )}

        <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-blue-500 shadow'>
          <h3 className='text-4xl pb-2'>comments</h3>
          <hr className='pb-2' />
         
            {post.comments.map((comment) =>(
            <div className='w-full max-w-screen-sm m-auto p-3 min-h-100 overflow-hidden' key={comment._id}>
                <div className='wrapper bg-white flex flex-row p-3 round-3xl shadow-blue-100 shadow'>
                    <div className='w-5/6 flex-grow-0'>
                        <div className='pl-3 text-gray-500'>
                            <div className='written-by uppercase text-gray-400 tracking-wide text-sm'>
                                written by
                            </div>
                            <div className='name font-bold py-1'>
                                {comment.name}
                            </div>
                            <div className='text-sm'>
                                <p>
                                    {comment.comment}
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
                
            </div>
        ))}
      </div>
    </main>
  )
}

export default Post

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
