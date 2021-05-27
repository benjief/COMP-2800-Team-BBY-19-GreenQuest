## My Web Application (Title)

* [Team Info](#team-info)
* [Ovewview](#overview)
* [Instructions](#instructions)

## Team Info
| First name    | Last name     | Student Number |
| ------------- | ------------- | -------------- |
| Samuel        | Tjahjadi      | A00978466      |
| Benjie        | Friedman      | A01248859      |
| Gyephel       | Tenzin        | A01178786      |
| Giwoun        | Bae           | A01243484      |

## Overview
We organized our repo by grouping file types together such as all HTML files into the "html" folder. 

 Top level of project folder: 
├── .gitignore                     # Git ignore file
├── .vs                            # vs
├── .vscode                        # Folder for the live server settings port
├── jquery_plugins                 # Folder for plugins like the jquery star-rating feature
├── mergelog                       # File with all the merge history
└── README.md                      # README file

It has the following subfolders and files:
├── .git                           # Folder for git repo
|
├── html                            # Folder for folders with coded files
|   /headcount.html            # Headcount updater
|   /main.html                 # Main page for employees
|   /reviews.html              # Reviews
|   /stats.html                # Stats
|   /storefront.html           # Storefront page for all stores
|   /stores.html               # Store list
|   /index.html                # Landing HTML file, this is what users see when you come tourl
|   /employee-login.html       # Employee login page
|   /member-login.html         # Member login page
|   /more-info.html            # Costco covid-related information
|   /feedback.html             # Feedback form
|   /main.html                 # Main page for members
|   /reviews.html              # Reviews
|   /stats.html                # Stats
|   /storefront.html           # Storefront page for all stores
|   /stores.html               # Store list
|   
├── images                         # Folder for images
|   /back_arrow.png                # App's back button
|   /costco.jpg                    # Picture used for index.html (landing page)
|   /covid1.jpg                    # Picture used for more-info.html
|   /covid2.jpg                    # Picture used for more-info.html
|   /covid3.jpg                    # Picture used for more-info.html
|   /covid4.jpg                    # Picture used for more-info.html
|   /covid5.jpg                    # Picture used for more-info.html
|   /down_arrow.png                # Icon used for headcount changes
|   /store_burnaby_storefront.png  # Picture used for the storefront page
|   /store_downtown_storefront.png # Picture used for the storefront page
|   /store_richmond_storefront.png # Picture used for the storefront page
|   /up_arrow.png                  # Icon used for headcount changes
├── scripts                        # Folder for scripts
|   /back.js                       # Back feature to return to the page you've last visited
|   /employee-login.js             # Employee login
|   /feedback.js                   # Feedback form that sends data to Cloud Firestore
|   /firebase-api-crowdmapp.js     # Our app's api for Cloud Firestore
|   /headcount.js                  # Sends data to Cloud Firestore
|   /hello.js                      # Says your name in the main page
|   /logout.js                     # Logs you out from your current session
|   /member-login.js               # Member login
|   /reviews.js                    # Reviews
|   /stats.js                      # Statistics
|   /storefront.js                 # Storefronts for all locations
|   /stores.js                     # Takes headcount data from Cloud Firestore
|   └── outdated-scripts           # Folder for unused or obsolete files
├── styles                         # Folder for stylesheets
|   /all-pages.css                 # Styles every page
|   /employee-login.css            # Styles specifically for employee-login.html
|   /employee-main.css             # Styles specifically for employee's main.html
|   /feedback.css                  # Styles specifically for feedback.html
|   /headcount.css                 # Styles specifically for headcount.html
|   /index.css                     # Styles specifically for index.html
|   /member-login.css              # Styles specifically for member-login.html
|   /member-main.css               # Styles specifically for member's main.html
|   /more-info.css                 # Styles specifically for more-info.html
|   /reviews.css                   # Styles specifically for reviews.html
|   /stats.css                     # Styles specifically for stats.html
|   /storefront.css                # Styles specifically for storefront.html
|   /stores.css                    # Styles specifically for stores.html
|   └── outdated-scripts           # Folder for unused or obsolete files
|
Firebase hosting files:               
├── .firebase                      # firebase
├── firebase.json                 # firebase json
├── .firebaserc                    # firebaserc
├── firestore.rules                # firestore rules
├── storage.rules                  # storage rules
└── firestore.indexes.json         # firestore indexes json

## Instructions on how to use GreenQuest

(Numbered list of setup instructions.)

1. Go to https://greenquest-5f80c.web.app/
2. Press "Sign up / Login" located at the bottom of the page
3. Click on the small circle beside the roles 
--------------------------------------------------------------------
For educator:
1. Enter the authentication key in the textbox, "123456"
2. Click "Sign in with email"
3. In the email address text field, enter "samuel_tjahjadi@outlook.com"
4. In the password text field, enter "123123"

You should now be at the educator-home screen

5. Press "Manage Classes"
6. Press "GQ"
7. Press "Add Students"
8. Select the students you would like to add
9. Press "Submit" and then "Home"
10. Press "Approve Quests" 

A quest should be there for you to approve

11. Approve the quest and reward an X amount of points or reject the quest
--------------------------------------------------------------------
For Students:
1. Click "Sign in with email"
2. In the email address text field, enter "samuel_tjahjadi@outlook.com"
3. In the password text field, enter "123123"

You should now be at the student-home screen

4. Press "My Profile"

You should see yourself as awell as the amount of points you have and your recent activities

5. Press "Home" and then "My Quest"
6. Press "Accept Quest" or "Skip Quest" for a new quest
7. Press "Instructions" or "More information" to learn more about the task
8. Press "Submist Quest"
9. Under "Quest Notes", enter the details of your quest and press "Submit"

You should be automatically taken back to the home page

10. Press "Quest History" 
11. Press "Pending Quest"

You should see the quest you recently submitted

12. Press "Home" 
13. Press "Leaderboards" 
14. Press one of the options available.

You should see your standing as well as your peers
--------------------------------------------------------------------












