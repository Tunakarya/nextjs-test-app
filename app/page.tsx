"use client"
import Image from 'next/image'
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Define the Post type
type Post = {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  city: string;
  country: string;
  position: string;
};

const getPosts = async (): Promise<Post[]> => {
  const data = await fetch("https://tunakarya.github.io/jsonapi/source.json");
  const posts = await data.json();
  return posts;
};

export default function ClientPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPostsAndSetState = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    };

    fetchPostsAndSetState();
  }, []);

  useEffect(() => {
    if (selectedPosition) {
      const trimmedSelectedPosition = selectedPosition.trim().toLowerCase();
      const newFilteredPosts = posts.filter((post) => {
        const trimmedPostPosition = post.position.trim().toLowerCase();
        return trimmedPostPosition === trimmedSelectedPosition;
      });
      setFilteredPosts(newFilteredPosts);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedPosition, posts]);

  const toggleModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalVisible(false);
  };

  return (
    <div className={`container mx-auto p-8 ${inter.className}`}>
      <h1 className="text-3xl font-semibold mb-6">Football Player List</h1>

      <div className="mb-6">
        <label className="mr-2">Position:</label>
        <select
          className="border p-2 rounded text-black"
          value={selectedPosition || ""}
          onChange={(e) => setSelectedPosition(e.target.value)}
        >
          <option value="">All</option>
          {Array.from(new Set(posts.map((post) => post.position))).map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div key={`${post.position}-${post.firstName}-${post.lastName}`} className="bg-white p-4 rounded-md shadow-md flex">
            <div className="flex-shrink-0 mr-4">
              <img src={post.avatar} alt="avatar" className="w-40 h-60 object-cover rounded-md" />
            </div>
            <div className="text-black flex flex-col w-full">
              <h2 className="text-lg font-semibold mb-2">{post.firstName} {post.lastName}</h2>
              <h4 className="text-md mb-4">Position : {post.position}</h4>
              <div>
                <button
                  onClick={() => toggleModal(post)}
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  Detail Player
                </button>
                {isModalVisible && selectedPost && (
                  <div
                    id="default-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-8 rounded-lg flex shadow-2xl"
                    style={{ maxWidth: '600px' }}
                  >
                    <div className="flex-shrink-0 mr-6">
                      <img src={selectedPost.avatar} alt="avatar" className="w-40 h-60 object-cover rounded-md" />
                    </div>
                    <div className="flex flex-col w-full">
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-gray-400 hover:text-gray-800"
                        data-modal-hide="default-modal"
                        onClick={closeModal}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                      <div className="space-y-1">
                        <p className="mb-1"><span className="font-semibold">First Name:</span> {selectedPost.firstName}</p>
                        <p className="mb-1"><span className="font-semibold">Last Name:</span> {selectedPost.lastName}</p>
                        <p className="mb-1"><span className="font-semibold">Email:</span> {selectedPost.email}</p>
                        <p className="mb-1"><span className="font-semibold">Telepon:</span> {selectedPost.phoneNumber}</p>
                        <p className="mb-1"><span className="font-semibold">Username:</span> {selectedPost.username}</p>
                        <p className="mb-1"><span className="font-semibold">Kota:</span> {selectedPost.city}</p>
                        <p className="mb-1"><span className="font-semibold">Negara:</span> {selectedPost.country}</p>
                        <p className="mb-1"><span className="font-semibold">Position:</span> {selectedPost.position}</p>
                        <p><span className="font-semibold">Email:</span> {selectedPost.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
