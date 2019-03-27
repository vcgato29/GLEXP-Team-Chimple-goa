### __Localization instructions for Bali__
__Change the content of the database.csv__

  1. 'Replace the data of third column with the Localized letters for 'Unit' section.'  
  2. 'Replace the heading of the Lesson, to update the same, replace the data of third column'  
  3. 'Replace the eight column of the Lesson Unit with the Localized letters'  
  4. 'Repeat the above step for all the Letter section'  
  5. 'Replace the heading of the Words lesson, to update the same, replace the data of third column with the Localized language heading'  
  6. 'Replace the data of ninth column of the Lesson Unit with the Localized words'  
  
__[Text to Speech Service] (Bali/app/src/main/java/org/chimple/bali/service/TextToSpeechService.java)__  

  1. Changed the arguments of the Locale function with the Localized language  
     For example, Indian English function will look like the below code:
     
     `int ttsLang = convertTextToSpeech.setLanguage(new Locale("en", "IN"));`
     
