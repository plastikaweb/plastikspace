/// <reference path="../pb_data/types.d.ts" />

// Ensure only one address per user can be marked as default.

// Collect sibling addresses still marked as default and flip them in a single
// transaction so SQLite issues one commit/fsync for the whole batch instead
// of one per row.
function clearOtherDefaults(app, record) {
    const others = app.findAllRecords(
        "user_addresses",
        $dbx.exp("user = {:user} AND id != {:id}", {
            user: record.getString("user"),
            id: record.id
        })
    );

    const stale = [];
    for (let i = 0; i < others.length; i++) {
        if (others[i] && others[i].getBool("default")) {
            stale.push(others[i]);
        }
    }

    if (stale.length === 0) {
        return;
    }

    app.runInTransaction((txApp) => {
        for (const other of stale) {
            other.set("default", false);
            txApp.save(other);
        }
    });
}

onRecordAfterCreateSuccess(function(e) {
    if (!e.record.getBool("default")) {
        return;
    }

    try {
        clearOtherDefaults(e.app, e.record);
    } catch (err) {
        console.log("single_default_address create error:", err);
    }
}, "user_addresses");

onRecordAfterUpdateSuccess(function(e) {
    if (!e.record.getBool("default")) {
        return;
    }

    try {
        clearOtherDefaults(e.app, e.record);
    } catch (err) {
        console.log("single_default_address update error:", err);
    }
}, "user_addresses");
