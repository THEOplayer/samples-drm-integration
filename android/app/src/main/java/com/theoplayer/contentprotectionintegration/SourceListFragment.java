package com.theoplayer.contentprotectionintegration;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.fragment.app.ListFragment;

public class SourceListFragment extends ListFragment {

    public final static String TAG = "SourceList";

    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        if (getActivity() != null) {
            String[] sourceNames = SourceManager.getInstance(getActivity()).getSourcesNames();
            ArrayAdapter<String> adapter =
                    new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, sourceNames);
            setListAdapter(adapter);
        }
    }

    @Override
    public void onListItemClick(@NonNull ListView l, @NonNull View v, int position, long id) {
        if (getListAdapter() == null) {
            return;
        }
        String item = (String) getListAdapter().getItem(position);
        Intent intent = new Intent(getActivity(), PlayerActivity.class);
        intent.putExtra(PlayerActivity.EXTRA_SOURCENAME, item);
        startActivity(intent);
    }
}
