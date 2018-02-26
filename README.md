# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality.

### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and look around for a bit to see what the current experience looks like.
3. Explore the provided code, and make start making a plan to implement the required features in three areas: responsive design, accessibility and offline use.
4. Write code to implement the updates to get this site on its way to being a mobile-ready website.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.


# CHANGE LOG

Keep track of the change I made on this project
In order to run the project, you need now nodeJS and PHP using NPM scripts run:

```
# install all the dependencies
npm install

# start the image processing and server port 3333
npm start
```

## Responsive Design
As a first step I added the viewport meta tag but without the initial scale because of this [MDN Doc](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images):

```
<meta name="viewport" content="width=device-width">
```

In order to make the site responsive I changed most of the fixed units (px) to relative units (rem, % and vh,vw)

I created 3 media breakpoints:
- (<500px): good for smartphones
- (500px-750px): great for tablets
- (>750px): good for desktop and laptop

I used a Grunt task to resize the images into 3 size as well:
- 800px
- 600px
- 400px

Since I'm serving different image sizes according to the viewport, I also had to update the Database Helper file (dbhelper.js) to dynamically return the image file I need (ex. 1-small.jpg, 1-medium.jpg, 1-large.jpg).

Finally I fixed the remaining UI bugs such as card overlapping stretched images and misplaced navigation bars.


## Accessibility
While the UI elements such as button had a nice orange color, the Accessibility rating of the was fairly low at about 45 points after running an audit using Google Chrome Lighthouse. A lot of the changes I had to made were mainly due to low contrasts ratio, small text, little buttons and missing HTML attributes such as Google Maps Title attribute which google maps doesn't provide by itself so I wrote a little script which searching for the Google Maps iFrame and attaches an HTML title attribute.

After all these changes the Accessibility score went from 45 points up to 100 points.


## Progressive Web App
I started running an Audit using Chromes built it Lighthouse and it go 42 point score. After that I started doing all the changes needed:

- I wrote a basic Service Worker which will cache static assets such as the CSS and JS files. It will also cache the images gradually as the user navigates each page in a separate image-cache.
- I added favicon icons for iOS and Android using [Favicon Generator](https://www.favicon-generator.org/)
- I added `a manifest.json` file for the app name, entry points and color scheme.
- Finally I added the required link and meta tags

After all the changes the PWA score went up from 42 points to 91 points. The only change left on the PWA checklist is `redirect HTTP traffic to HTTPS` which is not possible using a development environment right now but using Firebase hosting and the free HTTPS it should fulfill that requirement.
