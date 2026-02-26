/// <reference path="../pb_data/types.d.ts" />

// Auxiliary function to ensure that only one address can be set as default per user
function ensureSingleDefaultAddress(record) {
    // 1. If the address being saved is not "default", do nothing.
    if (!record.getBool('default')) {
        return;
    }

    const userId = record.getString('user');
    const currentId = record.getId(); // It can be empty if we are creating

    // 2. Search for all other addresses of this user that are 'default'
    // Exclude the one we are touching now (id != currentId)
    try {
        const otherDefaults = $app.findRecordsByFilter(
            "user_addresses",
            `user = {:user} && default = true && id != {:id}`,
            { user: userId, id: currentId }
        );

        // 3. Loop through the other defaults and set them to false
        for (const other of otherDefaults) {
            other.set('default', false);
            $app.save(other); // Save the change without triggering recursive hooks
        }
    } catch (err) {
        // Log error in case of failure
        console.log("Error resetting defaults: ", err);
    }
}

// Hook before creating an address
onRecordCreateRequest((e) => {
    ensureSingleDefaultAddress(e.record);
    return e.next();
}, "user_addresses");

// Hook before updating an address
onRecordUpdateRequest((e) => {
    ensureSingleDefaultAddress(e.record);
    return e.next();
}, "user_addresses");