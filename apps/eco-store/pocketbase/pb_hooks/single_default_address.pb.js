/// <reference path="../pb_data/types.d.ts" />

// Ensure only one address per user can be marked as default.

onRecordAfterCreateSuccess(function(e) {
    if (!e.record.getBool("default")) {
        return;
    }

    try {
        var others = e.app.findAllRecords(
            "user_addresses",
            $dbx.exp("user = {:user} AND id != {:id}", {
                user: e.record.getString("user"),
                id: e.record.id
            })
        );

        for (var i = 0; i < others.length; i++) {
            if (others[i] && others[i].getBool("default")) {
                others[i].set("default", false);
                e.app.save(others[i]);
            }
        }
    } catch (err) {
        console.log("single_default_address create error:", err);
    }
}, "user_addresses");

onRecordAfterUpdateSuccess(function(e) {
    if (!e.record.getBool("default")) {
        return;
    }

    try {
        var others = e.app.findAllRecords(
            "user_addresses",
            $dbx.exp("user = {:user} AND id != {:id}", {
                user: e.record.getString("user"),
                id: e.record.id
            })
        );

        for (var i = 0; i < others.length; i++) {
            if (others[i] && others[i].getBool("default")) {
                others[i].set("default", false);
                e.app.save(others[i]);
            }
        }
    } catch (err) {
        console.log("single_default_address update error:", err);
    }
}, "user_addresses");
