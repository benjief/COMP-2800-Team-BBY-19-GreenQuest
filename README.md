## My Web Application (Title: GreenQuest)



* [Team Info](#team-info)
* [Overview](#overview)
* [Educator Key](#educator-key)
* [Basic Setup](#basic-setup)
* [New Contributor](#instructions)


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
├── .gitignore                      # Git ignore file
├── .vscode                         # Folder for the live server settings port
├── mergelog                        # File with all the firestore merge history
├── index.html                      # Landing page
├── 404.html                        # Error page
└── README.md                       # README file

It has the following subfolders and files:
├── .github \ workflows             # folder for firebase-hosting-workflow
|
├── html                            # Folder for folders with coded files
|   /about-us.html                  # Page for about us
|   /educator-add-quest.html        # Educator page for adding quest to the firebase
|   /educator-add-students.html     # Educator page for adding students to class
|   /educator-approve-quest.html    # Educator page for approving quests students submitted
|   /educator-create-class.html     # Educator page for creating a virtual class/group
|   /educator-home.html             # Homepage for the educator only
|   /educator-manage-class.html     # Educator page for managing a class
|   /educator-manage-classes.html   # Educator page for managing multiple classes
|   /educator-new-home.html         # Homepage for the educator
|   /educator-remove-students.html  # Educator page for removing students from a class
|   /login.html                     # Login page for all visitors
|   /student-add-friends.html       # Student page for adding friend when submitting
|   /student-all-classes.html       # Student page class standings for all classes
|   /student-all-students.html      # Student page student standings for all students
|   /student-choose-quest.html      # Student page for choosing a quest
|   /student-home.html              # Homepage for students
|   /student-leaderboard.html       # Student page for leaderboard menus
|   /student-my-class.html          # Student page for standings in my class
|   /student-pending-quests.html    # Student page for pending quests awaiting approval/reject
|   /student-processed-quests.html  # Student page for processed quests
|   /student-profile.html           # Student page for student profile
|   /student-quest-history.html     # Student page for quest history
|   /student-submit-quest.html      # Student page for submitting quest
|   /student-view-quest.html        # Student page for viewing chosen quest
|   
├── images                          # Folder for images
|   /404.png                        # Picture for 404 page
|   /add_icon_gray.png              # Picture used for add-icon
|   /add_icon.png                   # Picture used for add-icon
|   /background_clouds.png          # Picture used for backgrounds for all pages
|   /background_img_preview.png     # Picture used for image-preview modal
|   /background_pattern_1.png       # Picture used for backgroud-patterns
|   /background_pattern_2.png       # Picture used for backgroud-patterns
|   /background_pattern_3.png       # Picture used for backgroud-patterns
|   /background_pattern_4.png       # Picture used for backgroud-patterns
|   /background_pattern_5.png       # Picture used for backgroud-patterns
|   /background_pattern_6.png       # Picture used for backgroud-patterns
|   /background_pattern_7.png       # Picture used for backgroud-patterns
|   /background_pattern_8.png       # Picture used for backgroud-patterns
|   /background_pattern.png         # Picture used for backgroudn-pattern for main content cards
|   /benjie_1.png                   # Picture used for easterEgg, about us page
|   /benjie_2.png                   # Picture used for easterEgg, about us page
|   /benjie_3.png                   # Picture used for easterEgg, about us page
|   /benjie_4.png                   # Picture used for easterEgg, about us page
|   /benjie_crane.png               # Picture used for easterEgg, about us page
|   /benjie_hi.png                  # Picture used for easterEgg, about us page
|   /benjie_ribbon.png              # Picture used for easterEgg, about us page
|   /bronze_ribbon.png              # Picture used for bronze medal for ranking
|   /facebook_icon.png              # Picture used for facebook icon
|   /giwoun_1.png                   # Picture used for easterEgg, about us page
|   /giwoun_2.png                   # Picture used for easterEgg, about us page
|   /giwoun_3.png                   # Picture used for easterEgg, about us page
|   /giwoun_4.png                   # Picture used for easterEgg, about us page
|   /gold_ribbon.png                # Picture used for gold medal for ranking
|   /gyephel_1.png                  # Picture used for easterEgg, about us page
|   /gyephel_2.png                  # Picture used for easterEgg, about us page
|   /gyephel_3.png                  # Picture used for easterEgg, about us page
|   /gyephel_4.png                  # Picture used for easterEgg, about us page
|   /leaf_icon.png                  # Picture used for points
|   /question_icon.png              # Picture used for points
|   /remove_icon.png                # Picture used for points
|   /sam_1.png                      # Picture used for easterEgg, about us page
|   /sam_2.png                      # Picture used for easterEgg, about us page
|   /sam_3.png                      # Picture used for easterEgg, about us page
|   /sam_4.png                      # Picture used for easterEgg, about us page
|   /silver_ribbon.png              # Picture used for silver medal for ranking
|   /slow_down.png                  # Picture used for error message
|   /twitter_icon.png               # Picture used for silver medal for ranking
| 
├── scripts                         # Folder for scripts| 
|   /about-us.js                    # Page for about us
|   /all-pages.js                   # Page for about us
|   /educator-add-quest.js          # JS file for adding quest to the firebase
|   /educator-add-students.js       # JS file for adding students to class
|   /educator-approve-quest.js      # JS file for approving quests students submitted
|   /educator-create-class.js       # JS file for creating a virtual class/group
|   /educator-home.js               # Homepage JS file for the educator only
|   /educator-manage-class.js       # JS file for managing a class
|   /educator-manage-classes.js     # JS file for managing multiple classes
|   /educator-new-home.js           # Homepage JS file for the educator
|   /educator-remove-students.js    # JS file for removing students from a class
|   /index.js                       # Landing page JS for all visitors
|   /login.js                       # Login JS for both student and educator
|   /logout.js                      # Logout JS for both student and educator
|   /student-add-friends.js         # JS file for adding friend when submitting
|   /student-all-classes.js         # JS file for class standings for all classes
|   /student-all-students.js        # JS file student standings for all students
|   /student-choose-quest.js        # JS file for choosing a quest
|   /student-home.js                # Homepage JS file for students
|   /student-leaderboard.js         # JS file for leaderboard menus
|   /student-my-class.html          # Student page for standings in my class
|   /student-pending-quests.js      # JS file for pending quests awaiting approval/reject
|   /student-processed-quests.js    # JS file for processed quests
|   /student-profile.js             # JS file for student profile
|   /student-quest-history.js       # JS file for quest history
|   /student-submit-quest.js        # JS file for submitting quest
|   /student-view-quest.js          # JS file for viewing chosen quest
|
├── styles                          # Folder for stylesheets
|   /404.css                        # Styles specifically for 404.html                     
|   /about-us.css                   # Styles specifically for about-us.html                
|   /all-pages.css                  # Styles specifically for all-pages.html               
|   /educator-add-quest.css         # Styles specifically for educator-add-quest.html      
|   /educator-add-students.css      # Styles specifically for educator-add-students.html   
|   /educator-approve-quest.css     # Styles specifically for educator-approve-quest.html   
|   /educator-create-class.css      # Styles specifically for educator-create-class.html   
|   /educator-home.css              # Styles specifically for educator-home.html           
|   /educator-manage-class.css      # Styles specifically for educator-manage-class.html   
|   /educator-manage-classes.css    # Styles specifically for educator-manage-classes.html 
|   /educator-new-home.css          # Styles specifically for educator-new-home.html       
|   /educator-remove-students.css   # Styles specifically for educator-remove-students.html
|   /index.css                      # Styles specifically for index.html                   
|   /login.css                      # Styles specifically for login.html                   
|   /student-add-friends.css        # Styles specifically for student-add-friends.html     
|   /student-all-classes.css        # Styles specifically for student-all-classes.html     
|   /student-all-students.css       # Styles specifically for student-all-students.html    
|   /student-choose-quest.css       # Styles specifically for student-choose-quest.html    
|   /student-home.css               # Styles specifically for student-home.html            
|   /student-leaderboard.css        # Styles specifically for student-leaderboard.html     
|   /student-my-class.css           # Styles specifically for student-my-class.html        
|   /student-pending-quests.css     # Styles specifically for student-pending-quests.html  
|   /student-processed-quests.css   # Styles specifically for student-processed-quests.html
|   /student-profile.css            # Styles specifically for student-profile.html         
|   /student-quest-history.css      # Styles specifically for student-quest-history.html   
|   /student-submit-quest.css       # Styles specifically for student-submit-quest.html    
|   /student-view-quest.css         # Styles specifically for student-view-quest.html      
|
Firebase hosting files:               
├── .firebase                       # contains hosting..cache for firebase
├── firebase.json                   # firebase json
├── .firebaserc                     # firebaserc
├── firestore.rules                 # firestore rules
├── storage.rules                   # storage rules
└── firestore.indexes.json          # firestore indexes json

--------------------------------------------------------------------
## Educator Key

Educator need a code to sign in as educator and use its functionalities.
Educator key is coded in login.js

**********************************************************************
************************ FOR TESTING *********************************
****** TO SIGN IN/or SIGN UP AS EDUCATOR, THE CODE IS 123456 *********
**********************************************************************

--------------------------------------------------------------------
## Basic setup

Main languages used are HTML, CSS, JavaScript. 
New contributor must have account for gitHub, and Firebase and be added a collaborator.

* language: HTML, CSS, JavaScript, jQuery, JSON
* IDE: VSCode
* Hosting: Firebase through GitHub Automation Action
    - github workflows settings are saved under /.github. 
* Firebase (firestore, firebase, hosting)


--------------------------------------------------------------------

## New Contributor

To become a contributer, you must first do the following steps

Connecting to GitHub:
* Get an invitation to the Github Repository
* Under "Code", copy the HTTPS link
* Open Windows Command Prompt
* Navigate to where you want your file to be
* In the command prompt, type Git Clone and paste the HTTP Link

Now you have a copy of the application files

* Open VSCode
* Click on file, then open folder and navigate to where you stored your
  copied files
* Press "Open"

Your IDE should no display the source code of the application

--------------------------------------------------------------------

Connecting to Firebase:
* Get an invitation to the Firebase database
* Login with an account of your choice
* Click on "console" in the navigation bar
* Click on the application you have been invited to

You should now have access to the database portion of the application

















