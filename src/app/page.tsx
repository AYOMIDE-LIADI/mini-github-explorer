'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import useDarkMode from '../hooks/useDarkMode';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; 


type GithubUser = {
  avatar_url: string;
   name: string | null;
   bio: string | null;
   public_repos: number;
   followers: number;
  following: number;
  html_url: string;
  login: string;
};

type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  updated_at: string;
};

export default function HomePage() {
   const { isDark, toggleTheme } = useDarkMode();
  const { data: session } = useSession();
  
  const [username, setUsername] = useState('');
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const uRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      if (!uRes.ok) {
        if (uRes.status === 404) throw new Error('User not found');
        throw new Error('Failed to fetch user');
      }
      const uData: GithubUser = await uRes.json();
      setUser(uData);

      const rRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5`
      );
      if (!rRes.ok) throw new Error('Failed to fetch repositories');
      const rData: GithubRepo[] = await rRes.json();
      setRepos(rData);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  return (
   <main className="min-h-screen relative bg-gradient-to-br from-base-200 via-base-300 to-base-100 text-base-content">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 cursor-pointer rounded-full w-6 h-6 lg:w-12 lg-h-12 md:w-8 md:h-8 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-110 transition transform shadow-md absolute md:right-4 right-1 top-3"
          aria-label="Toggle Theme"
        >
          {isDark ? <SunIcon className="w-5 h-5 md:w-6 md:h-6" /> : <MoonIcon className="w-5 h-5 md:w-6 md:h-6" />}
        </button>

        
  {!session ? (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-primary ">
        Welcome to Mini GitHub Explorer 
      </h1>
      <p className="text-base md:text-lg opacity-80 ">
        Please sign in to continue
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-sm mx-auto">
      <button
        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition transform"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Sign in with Google
      </button>

      <button
        className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 hover:scale-105 transition transform"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        Sign in with GitHub
      </button>
    </div>

    </div>
  ) : (
    <div className="min-h-screen">
      <div className="flex flex-col  sm:flex-row items-center justify-between md:px-24 md:mt-0 py-4 bg-base-200 shadow-md">
        <p className="text-base md:text-lg">
          Welcome, <span className="font-semibold text-primary">{session.user?.name || session.user?.email}</span>
        </p>
        <button className="btn btn-error mt-3 cursor-pointer sm:mt-0 shadow-sm" onClick={() => signOut()}>
          Sign out
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">
          Mini GitHub Explorer
        </h1>

        <div className="flex flex-col md:flex-row gap-3 mb-12">
          <input
            className="input input-bordered w-full px-3 py-2 text-base focus:ring-2 focus:ring-primary transition"
            placeholder="🔍 Search GitHub username…"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
          />
         

          <button 
            onClick={fetchData} 
            className="btn bg-blue-600 md:py-0 py-1.5 px-2.5 text-sm btn-primary rounded-sm cursor-pointer md:shrink-0 w-full md:w-auto shadow-md hover:scale-105 transition"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6 text-center">
            <span>{error}</span>
          </div>
        )}

        {!loading && !user && !error && (
          <p className="text-base opacity-70 text-center">Search a username to begin.</p>
        )}

        {user && (
          <div className="card bg-base-100 shadow-xl mb-8 border-base-200 p-3.5">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <img
                  src={user.avatar_url}
                  alt={`${user.login} avatar`}
                  className="w-28 h-28 rounded-full ring ring-primary ring-offset-2 shadow-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <h2 className="card-title text-lg md:text-xl">{user.name ?? user.login}</h2>
                    <a
                      href={user.html_url}
                      target="_blank"
                      className="link link-primary text-sm"
                      rel="noreferrer"
                    >
                      View on GitHub ↗
                    </a>
                  </div>
                  {user.bio && <p className="text-sm opacity-80 mt-2">{user.bio}</p>}
                  <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
                    <div className="badge badge-primary badge-outline">Repos: {user.public_repos}</div>
                    <div className="badge badge-secondary badge-outline">Followers: {user.followers}</div>
                    <div className="badge badge-accent badge-outline">Following: {user.following}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {repos.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-primary text-center sm:text-left">
              Latest Repositories
            </h3>
            <ul className="divide-y divide-base-300 rounded-xl overflow-hidden bg-base-100 shadow-md">
              {repos.map((r) => (
                <li key={r.id} className="p-4 hover:bg-base-200 transition">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <a
                        href={r.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-base link link-hover break-words"
                      >
                        {r.name}
                      </a>
                      {r.description && (
                        <p className="text-sm opacity-80 mt-1">{r.description}</p>
                      )}
                    </div>
                    <div className="text-sm opacity-70 text-right sm:text-left">
                      ⭐ {r.stargazers_count} • Updated {formatDate(r.updated_at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )}
</main>

  );
}

