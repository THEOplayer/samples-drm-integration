package com.theoplayer.contentprotectionintegration;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getSupportFragmentManager()
                .beginTransaction()
                .add(R.id.frame_container, new SourceListFragment(), SourceListFragment.TAG)
                .disallowAddToBackStack()
                .commit();
    }
}
