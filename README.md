# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

# CHANGE LOG

## Stage 3

**Performance**: I used the IntersectionObserver libary and the polyfill to lazy load images and prioritize the above the fold content. Google maps increased the time for the first paint by a lot therefore I added a placeholder image for the map. The user can load the map asynchronously by clicking the placeholder image. Netword calls have been reduced by checking offline stored content first and serving from cache/indexedDB. I used the built in indexedDB instead of a third party library to reduce the javascipt size.

**Accessibility**: I changed the button colors to comply with the minimum contrast ratio while keeping the design as close to the original as possible. I added labels for the dropdown menus to make it easier for visual readers to understand the content. I also added a title to the map iframe asynchronously to give the visual reader a better idea of what the map shows.


## Stage 1 and 2

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

## Progressive Web App
I started running an Audit using Chromes built it Lighthouse and it got 42 point score. After that I started doing all the changes needed:

- I wrote a Service Worker which will cache static assets such as the CSS and JS files. It will also cache the images gradually as the user navigates each page in a separate image-cache.
- I added favicon icons for iOS and Android using [Favicon Generator](https://www.favicon-generator.org/)
- I added `a manifest.json` file for the app name, entry points and color scheme.
- Finally I added the required link and meta tags

After all the changes the PWA score went up from 42 points to 91 points. The only change left on the PWA checklist is `redirect HTTP traffic to HTTPS` which is not possible using a development environment right now but using Firebase hosting and their free HTTPS it should fulfill that requirement.


## Code Credit
Some of the code I used is based of some articles I read and courses I took during this Nanodegree:
- Service Worker: Based on the [SW course on Udacity](https://eu.udacity.com/course/offline-web-applications--ud899) with my own changes and ES6 features
- Image resizing (`Gruntfile.js`): Based on the [Responsive Image course on Udacity](https://eu.udacity.com/course/responsive-images--ud882) and [MDN Docs](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- Responsive CSS: Based on [Responsive Web Fundamentals](https://eu.udacity.com/course/responsive-web-design-fundamentals--ud893)
- `mainfest.json`: This file was created by [Favicon Generator](https://www.favicon-generator.org/) not me, I just customized it to fit all the Chrome Lighthouse requirements using the PWA checklist and reference docs.
