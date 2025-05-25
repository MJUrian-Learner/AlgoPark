package utils

func FormatResponse(data interface{}) map[string]interface{} {
    return map[string]interface{}{
        "data": data,
    }
}
