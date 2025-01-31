window.function = async function(api_key, vector_store_id, name, metadata, expires_after) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Validate Vector Store ID
    if (!vector_store_id.value) {
        return "Error: Vector Store ID is required.";
    }

    // Parse JSON values if provided
    const parseJson = (input, fieldName) => {
        if (!input || !input.value) return undefined;
        try {
            return JSON.parse(input.value);
        } catch (e) {
            return `Error: Invalid JSON format for ${fieldName}.`;
        }
    };

    const metadataValue = parseJson(metadata, "metadata");
    const expiresAfterValue = parseJson(expires_after, "expires_after");

    // Construct request payload
    const payload = {};

    if (name.value) payload.name = name.value;
    if (metadataValue) payload.metadata = metadataValue;
    if (expiresAfterValue) payload.expires_after = expiresAfterValue;

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/vector_stores/${vector_store_id.value}`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
