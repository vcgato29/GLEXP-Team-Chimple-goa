package org.chimple.bali.service;

import android.content.Context;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Log;

import java.util.Locale;

import static android.content.ContentValues.TAG;

public class TextToSpeechService {
    private TextToSpeech convertTextToSpeech;

    public TextToSpeechService(Context context) {
        convertTextToSpeech = new TextToSpeech(context, status -> {
            if (status == TextToSpeech.SUCCESS) {

                // set the language
                int ttsLang = convertTextToSpeech.setLanguage(new Locale("en", "IN"));
                if (ttsLang == TextToSpeech.LANG_MISSING_DATA
                        || ttsLang == TextToSpeech.LANG_NOT_SUPPORTED) {
                    Log.e("TTS", "The Language is not supported!");
                } else {
                    // set the speed at which the audio is played
                    convertTextToSpeech.setSpeechRate((float) 0.8);
                }
                Log.i("TTS", "TTS Initialization successful");
            } else {
                Log.i("TTS", "TTS Initialization failed!");
            }
        });
    }

    public void convertTextToSpeech(String text, int queueMode, Bundle params, String utteranceId) {
        try {
            // Use TTS engine to play audio
            convertTextToSpeech.speak(text, queueMode, params, utteranceId);
        } catch (Exception e) {
            Log.e(TAG, "Could not convert text to speech");
        }
    }
}