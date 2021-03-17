package com.theoplayer.contentprotectionintegration;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.theoplayer.android.api.THEOplayerView;
import com.theoplayer.android.api.source.SourceDescription;

public class PlayerActivity extends AppCompatActivity {

    public final static String EXTRA_SOURCENAME = "sourceName";

    private THEOplayerView playerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player);

        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String sourceName = extras.getString(EXTRA_SOURCENAME);
            playerView = findViewById(R.id.theoplayer);
            SourceDescription sourceDescription = SourceManager.getInstance(this).getSource(sourceName);
            playerView.getPlayer().setSource(sourceDescription);
            playerView.getPlayer().play();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (playerView != null) {
            playerView.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (playerView != null) {
            playerView.onResume();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (playerView != null) {
            playerView.onDestroy();
        }
    }
}
