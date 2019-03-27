/*
 * Copyright 2017, Team Chimple
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.chimple.bali.widget;

import android.animation.ObjectAnimator;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.speech.tts.TextToSpeech;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.StyleRes;
import android.support.design.widget.FloatingActionButton;
import android.text.Html;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import org.chimple.bali.R;
import org.chimple.bali.db.entity.Unit;
import org.chimple.bali.service.TextToSpeechService;

public class WordView extends FrameLayout{
    private Unit mWord;
    private FloatingActionButton mSoundFab;
    private Context mContext;
    TextToSpeechService textToSpeechService = new TextToSpeechService(getContext());

    private final View.OnClickListener mOnClickListener = new View.OnClickListener() {

        @Override
        public void onClick(View view) {
            try {
                // Use TTS engine to play audio
                textToSpeechService.convertTextToSpeech("अ", TextToSpeech.QUEUE_FLUSH, null, null);
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                view.setEnabled(false);
            }
        }
    };

    public WordView(@NonNull Context context, Unit word) {
        super(context);
        initView(context, word);
    }

    public WordView(@NonNull Context context, @Nullable AttributeSet attrs, Unit word) {
        super(context, attrs);
        initView(context, word);
    }

    public WordView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr, Unit word) {
        super(context, attrs, defStyleAttr);
        initView(context, word);
    }

    public WordView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr, @StyleRes int defStyleRes, Unit word) {
        super(context, attrs, defStyleAttr, defStyleRes);
        initView(context, word);
    }

    private void initView(Context context, Unit word) {
        mContext = context;
        mWord = word;
        View view = inflate(getContext(), R.layout.word, null);
        addView(view);
        TextView wordView = (TextView) findViewById(R.id.word);
//        wordView.setText(Html.fromHtml("<b>"+word.name+"</b><i>h</i>"));
        wordView.setText(word.name);

        ImageView imageView = (ImageView) findViewById(R.id.imageView);
        Drawable d = word.getPictureDrawable(context);
        if(d != null) {
            imageView.setImageDrawable(d);
        }
        mSoundFab = (FloatingActionButton) findViewById(R.id.soundFab);
        float x = mSoundFab.getX();
        mSoundFab.setOnClickListener(mOnClickListener);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        float x = mSoundFab.getX();
        float y = mSoundFab.getY();
        ObjectAnimator animator = ObjectAnimator.ofFloat(mSoundFab, "x", -x, x);
        animator.setDuration(250);
        animator.start();

    }
}
