package com.climb.eip.climb.bus;

import com.squareup.otto.Bus;
import com.squareup.otto.ThreadEnforcer;

/**
 * Created by Younes on 01/03/2017.
 */

public final class BusProvider {

    private static final Bus BUS = new Bus(ThreadEnforcer.ANY);
    public static Bus getInstance() {
        return BUS;
    }
    private BusProvider() {
    }
}
