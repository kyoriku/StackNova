# StackNova

## Built With  
- [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
- [![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)](https://react.dev/)  
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=TailwindCSS&logoColor=white)](https://tailwindcss.com/docs/installation/using-vite)  
- [![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154.svg?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest/docs/framework/react/installation)  
- [![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=Node.js&logoColor=white)](https://nodejs.org/)  
- [![Express](https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white)](https://expressjs.com/)  
- [![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=white)](https://www.mysql.com/)  
- [![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7.svg?style=for-the-badge&logo=Sequelize&logoColor=white)](https://sequelize.org/)  
- [![Redis](https://img.shields.io/badge/Redis-DC382D.svg?style=for-the-badge&logo=Redis&logoColor=white)](https://redis.io/)  
- [![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/guide/)  

## Features  
- **Advanced Search**: Find posts by title, content, author, date, or comments.  
- **Pagination**: Displays 10 posts per page for better navigation.  
- **Responsive UI**: Adaptive design with light/dark modes powered by `tailwind`.  
- **Server-Side Caching**: Speeds up responses using `redis`.  
- **Client-Side Caching & Prefetching**: Optimized data fetching with `tanstack/react-query`.  
- **Rate Limiting**: Protects against excessive requests using `express-rate-limit`, restricting login attempts, post submissions, and comment submissions.  
- **Validation & Sanitization**: Ensures clean and safe input with `express-validator` and `sanitize-html`, preserving Markdown formatting while preventing XSS.  
- **Rich Icons**: Clean and modern icons provided by `lucide-react`.  
- **Markdown Support**: Write and format posts with `react-markdown` and syntax highlighting via `prism-react-renderer`.  
- **Performance Benchmarking**: Measures database vs. cache query times using `perf_hooks`, providing insights into performance improvements.  
-

## To Do
- [x] Favicon
- [ ] Improve accessibility
- [ ] Modularize code (similar structure as my react-portfolio)
- [ ] Meta tags for SEO
- 