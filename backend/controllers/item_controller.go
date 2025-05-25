package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
    // Logic to retrieve items
    c.JSON(http.StatusOK, gin.H{"message": "Get all items"})
}

func CreateItem(c *gin.Context) {
    // Logic to create an item
    c.JSON(http.StatusCreated, gin.H{"message": "Item created"})
}
