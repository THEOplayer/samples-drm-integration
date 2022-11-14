package com.theoplayer.contentprotectionintegration

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.contentprotectionintegration.databinding.ActivityPlayerBinding

class PlayerActivity : AppCompatActivity() {
    private lateinit var playerView: THEOplayerView
    private lateinit var viewBinding: ActivityPlayerBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.TheoTheme_Base)
        super.onCreate(savedInstanceState)

        viewBinding = ActivityPlayerBinding.inflate(layoutInflater)
        val view = viewBinding.root
        setContentView(view)

        playerView = viewBinding.theoplayer
        playerView.player.addEventListener(PlayerEventTypes.ERROR) { error ->
            viewBinding.message.text = error.errorObject.message
        }

        // Get source description from the extras bundle
        val extras = intent.extras
        if (extras != null) {
            val sourceName = extras.getString(EXTRA_SOURCE_NAME)
            val sourceDescription = SourceManager.getInstance(this).getSource(sourceName)

            playerView.player.apply {
                source = sourceDescription
                play()
            }
        }
    }

    override fun onPause() {
        super.onPause()
        playerView.onPause()
    }

    override fun onResume() {
        super.onResume()
        playerView.onResume()
    }

    override fun onDestroy() {
        super.onDestroy()
        playerView.onDestroy()
    }
}