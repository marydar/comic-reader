# Comic Reader & Management App

A full-featured web application for reading, publishing, and managing comics. Built with **React**, **Next.js App Router**, **Tailwind CSS**, and **Convex**, and deployed on **Vercel**.

---

## Live Demo

[**View the Application on Vercel**](https://comic-reader-omega.vercel.app/)  

---

## Overview

This application provides a seamless platform for users to discover, read, and publish comics. It includes robust management tools for creators, as well as advanced browsing and filtering capabilities for readers.

---

## Features

### User Management
- **Authentication**: User login and signup.
- **User Pages**: Personal profile pages for all users, displaying:
  - Account information  
  - Reading history  
  - Published comics  
  - Subscribed comics  
  - ComicLists created and saved by the user

### Comic Publishing
- **Publish & Manage**: Create new comics and add chapters.  
- **Editing Tools**: Edit or remove comics and chapters.  
- **Image Validation**: Automatic resolution checks for covers, thumbnails, and chapter images.

### Browsing & Discovery
- **Home Page**:
  - Popular comics  
  - Personalized “For You” recommendations  
  - Popular comics by genre  
- **Browse Page**:
  - Paginated list of comics with numbered page navigation  
  - Search by name  
  - Filter by genre  
  - Sort by name, date, views, or subscription count  
  - Filters stored in URL parameters for easy sharing

### Comic & Chapter Experience
- **Comic Page**:
  - Detailed information about the comic and its creator  
  - Clickable creator profile  
  - Chapter list with sorting options  
  - Suggested comics  
  - ComicLists containing the comic, drawn from all user-created lists  
  - Add to ComicList: search, create, and manage ComicLists to include the comic  
  - Subscribe and resume reading where you left off  
  - Creator-only controls: add new chapters, delete chapters or the entire comic

- **Chapter Page**:
  - High-resolution image reader  
  - Like chapters  
  - Next/Previous chapter navigation  
  - Complete chapter list  
  - Auto-scroll with adjustable speed slider  

### ComicLists
- Create and manage custom comic collections.
- Public ComicLists accessible across the platform.

---

## Planned Features
Future updates will include:
- Follow other users and view followers/following lists.
- Comment on chapters.
- Edit chapters and comic details.
- Chapter images preview on chapter pages.
- Adjustable zoom for chapter pages.

---

## Technology Stack
- **Frontend**: React, Next.js (App Router), Tailwind CSS  
- **Backend**: Convex  
- **Deployment**: Vercel  

---

## Screenshots
![Home Page](/images/home-hero.png)
![Home Page 2](/images/home-category.png)
![Comic Page Dark](/images/comic-page-dark.png)
![Chapter Reading Page](/images/chapter-reading-page.png)
![Comic Page Light](/images/comic-page-light.png)
![Comic Page Light Lists](/images/comic-light-lists.png)
![User Page](/images/user-page.png)
![Publish Comic](/images/publish-comic.png)
![Publish Chapter Filled](/images/publish-chapter-filled.png)
![Browse Pagination](/images/browse-pagination.png)
![Browse Filters](/images/browse-filter.png)

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd <project-directory>
npm install
