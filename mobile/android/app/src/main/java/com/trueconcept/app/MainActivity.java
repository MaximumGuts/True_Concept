package com.trueconcept.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Edge-to-edge: app content draws behind transparent system bars
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }
}
