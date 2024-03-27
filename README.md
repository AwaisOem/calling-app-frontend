# Tech Stack
    React + Vite + Supabase(Postgres, REST, RPC, Google Auth) + PeerJs Server(Signalling , WebRTC)

# HOW to Setup on Your machine
    - Clone Repo
    - Run `pnpm install` or `npm i`
    - Create Project in Supabase and Enable Google Auth By Using Google Clound Credientials
    - Create ".env" file in root folder
    - add enviorment variables in .env like
        `REACT_APP_SUPABASE_URL="get from supabase dashboard"`
        `REACT_APP_SUPABASE_ANON_KEY="get from supabase dashboard"`
        `REACT_APP_IS_DEVELOPMENT=false`
    - Run `pnpm run dev` for Development and visit http://localhost:5173/
    - Build Command `pnpm build`
    - Enjoy the app

### Contact if you want to build this along me (Contribute Code)