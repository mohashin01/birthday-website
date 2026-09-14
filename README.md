# Happy Birthday Maria 💌

## ফাইল স্ট্রাকচার
```
birthday-site/
├── index.html        → মূল সাইট
├── admin.html         → ছবি+কোট সাজানোর টুল (শুধু নিজের জন্য, শেয়ার করবে না)
├── css/style.css
├── js/main.js
├── js/photos-data.js  → ছবি ও কোটের ডাটা (admin.html দিয়ে regenerate হবে)
└── images/            → তোমার আসল ছবি এখানে রাখবে
```

## ধাপে ধাপে যা করতে হবে

### ১. VS Code এ প্রিভিউ দেখো
`index.html` ফাইলে right-click করে **"Open with Live Server"** (extension না থাকলে ইনস্টল করে নাও), অথবা ব্রাউজারে সরাসরি ফাইলটা খুলেও দেখতে পারো। এখন sample ছবি দিয়ে ডেমো চলছে।

### ২. তোমার আসল ছবি ও কোট বসাও
1. `admin.html` ফাইলটা ব্রাউজারে খোলো (ডাবল ক্লিক করলেই হবে)
2. ছবি সিলেক্ট করো, প্রতিটার নিচে quote লেখো, দরকার হলে ড্র্যাগ করে অর্ডার ঠিক করো
3. **"Generate Code"** ক্লিক করো
4. যে কোড আসবে সেটা কপি করে `js/photos-data.js` ফাইলে পুরোটা বসিয়ে দাও (পুরনো কনটেন্ট মুছে)
5. নিচের **Download** বাটনগুলো দিয়ে প্রতিটা ছবি ডাউনলোড করে `images/` ফোল্ডারে রাখো (আগের sample ছবিগুলো মুছে ফেলতে পারো)

### ৩. জন্ম তারিখ/নাম পরিবর্তন করতে চাইলে
`js/main.js` ফাইলের একদম উপরে:
```js
const GIRL_NAME = "Maria";
```
এবং `index.html`-এ scratch card এর "Year" ঘরে (`data-answer="❤"` ও ভেতরের `<div class="scratch-answer">❤</div>`) চাইলে সাল বসিয়ে দিতে পারো।

### ৪. GitHub এ হোস্ট করো
```bash
git init
git add .
git commit -m "birthday website"
git branch -M main
git remote add origin https://github.com/<তোমার-username>/<repo-name>.git
git push -u origin main
```
তারপর GitHub রিপোর **Settings → Pages** এ গিয়ে:
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)**
- Save করো

কিছুক্ষণ পর লিংক পাবে: `https://<username>.github.io/<repo-name>/`
এই লিংকটাই মারিয়াকে পাঠাবে। (⚠️ `admin.html` রিপোতে থাকলেও সমস্যা নেই — লিংক না দিলে ও ওটা দেখবে না)

## Tips
- ছবি বেশি বড় সাইজের হলে সাইট স্লো লোড হবে — আপলোডের আগে ছবিগুলো ছোট (compress) করে নিলে ভালো।
- মোবাইলে টেস্ট করে নিও পাঠানোর আগে।
