import React from 'react'
import Link from 'next/link'
import { Post } from '../typings';
import {sanityClient, urlFor} from "../sanity"

interface Props {
  posts: [Post];
}

function Posts({posts}: Props) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6'>
    if {posts.map(post => (
      <Link key={post._id} href={`/post/${post.slug.current}`} >
       <div className='group cursor-pointer border rounded-lg overflow-hidden'>
         <img className='h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out ' src={urlFor(post.mainImage).url()!} alt="" />
         <div className='flex justify-between p-5'>
           <div>
             <p className='text-lg font-bold'>{post.title}</p>
             <p className='text-xs'>{post.description} by {post.author.name}</p>
           </div>

           <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} alt="" />
         </div>
        
       </div>
      </Link>
    ))}
   </div>
  )
}

export default Posts

export const getServerSideProps = async () => {
   
    const query = `*[_type == "post"] {
      _id,
      title,
      author-> {
       name,
       image
      },
      description,
      mainImage,
      slug
    }`;
    const posts = await sanityClient.fetch(query);
    return{
      props: {
        posts,
      }
    }
}