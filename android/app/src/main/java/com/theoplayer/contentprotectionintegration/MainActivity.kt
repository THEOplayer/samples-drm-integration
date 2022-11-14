package com.theoplayer.contentprotectionintegration

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.AdapterView
import android.widget.AdapterView.OnItemClickListener
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import com.theoplayer.contentprotectionintegration.databinding.ActivityMainBinding

const val EXTRA_SOURCE_NAME = "sourceName"

class MainActivity : AppCompatActivity() {
    private lateinit var viewBinding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.TheoTheme_Base)
        super.onCreate(savedInstanceState)

        // Inflating view and obtaining an instance of the binding class.
        viewBinding = ActivityMainBinding.inflate(layoutInflater)
        val view = viewBinding.root
        setContentView(view)

        populateSources()
    }

    private fun populateSources() {
        val listView = viewBinding.sourceList
        val adapter = ArrayAdapter(this, R.layout.list_item, R.id.list_item_name, SourceManager.getInstance(this).sourcesNames)
        listView.adapter = adapter
        listView.onItemClickListener =
            OnItemClickListener { _: AdapterView<*>?, _: View?, position: Int, _: Long ->
                val intent = Intent(this, PlayerActivity::class.java)
                intent.putExtra(EXTRA_SOURCE_NAME, adapter.getItem(position))
                startActivity(intent)
            }
    }
}