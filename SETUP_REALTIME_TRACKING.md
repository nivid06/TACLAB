# 🚀 Real-Time Visitor Tracking Setup Guide

This guide will help you set up the real-time visitor tracking and email collection system for your TACLAB website.

## 📋 What You Need

1. **PHP 7.0 or higher** (to run the backend API)
2. **A web server** (Apache, Nginx, or PHP's built-in server)
3. **Write permissions** (for the `data` folder)

---

## ⚡ Quick Start (For Local Testing)

### Option 1: Using PHP Built-in Server (Easiest)

1. **Check if PHP is installed:**
   ```bash
   php -v
   ```
   
   If you see a version number (like PHP 8.x.x), you're good! If not, install PHP:
   
   **On Mac:**
   ```bash
   brew install php
   ```
   
   **On Ubuntu/Linux:**
   ```bash
   sudo apt-get update
   sudo apt-get install php
   ```
   
   **On Windows:**
   Download from https://www.php.net/downloads

2. **Navigate to your project folder:**
   ```bash
   cd "/Users/nivid/Desktop/3d printing"
   ```

3. **Start the PHP server:**
   ```bash
   php -S localhost:8000
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:8000/index.html
   ```

5. **That's it!** Your website is now running with real-time tracking! 🎉

---

## 🌐 Deploying to a Live Server

### For Shared Hosting (like Hostinger, Bluehost, GoDaddy)

1. **Upload all files via FTP:**
   - Upload `index.html`
   - Upload `api.php`
   - Upload all other files (CSS, JS, images)

2. **Set folder permissions:**
   - The script will automatically create a `data` folder
   - Make sure your hosting has write permissions enabled

3. **Test the API:**
   Visit: `https://yourdomain.com/api.php?action=health`
   
   You should see:
   ```json
   {
     "success": true,
     "message": "TACLAB Analytics API is running"
   }
   ```

4. **Done!** Your tracking is now live across all devices! 🚀

### For VPS/Cloud Server (DigitalOcean, AWS, etc.)

1. **Install Apache and PHP:**
   ```bash
   sudo apt-get update
   sudo apt-get install apache2 php libapache2-mod-php
   ```

2. **Copy files to web root:**
   ```bash
   sudo cp -r "/Users/nivid/Desktop/3d printing/"* /var/www/html/
   ```

3. **Set permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/
   sudo chmod -R 755 /var/www/html/
   ```

4. **Restart Apache:**
   ```bash
   sudo systemctl restart apache2
   ```

5. **Access your site:**
   ```
   http://your-server-ip/index.html
   ```

---

## 🧪 Testing Real-Time Tracking

1. **Open your website on Computer 1:**
   - You should see the welcome popup
   - Submit your email or skip

2. **Open the Admin Dashboard:**
   - Click menu → Admin Dashboard
   - Login: `admin` / `admin`
   - You should see **1 visitor**

3. **Open your website on Computer 2 (or phone):**
   - The visitor count should update automatically
   - Check the dashboard - you'll now see **2 visitors**!

4. **Real-time updates:**
   - Dashboard refreshes every 5 seconds
   - All devices see the same data
   - Works across different browsers and computers

---

## 📁 File Structure

```
3d printing/
├── index.html           # Your main website
├── api.php             # Backend API (tracks visitors & emails)
├── data/               # Auto-created folder for storage
│   ├── visitors.json   # All visitor records
│   ├── emails.json     # Email subscribers & coupons
│   └── stats.json      # Statistics summary
└── (other files...)
```

---

## 🔧 Troubleshooting

### Problem: "API Connection Failed" in browser console

**Solution:**
- Make sure `api.php` is in the same folder as `index.html`
- Make sure PHP is running (use `php -S localhost:8000`)
- Check browser console for detailed error messages

### Problem: "Failed to track visitor"

**Solution:**
- Check if `data` folder has write permissions
- On Linux/Mac: `chmod 755 data`
- On shared hosting: Use FTP to set folder permissions to 755

### Problem: Dashboard shows 0 visitors but people visited

**Solution:**
- Open browser console (F12) and check for errors
- Verify API is working: visit `/api.php?action=health`
- Make sure you're not blocking cookies/JavaScript

### Problem: Can't see the data folder

**Solution:**
- It's created automatically on first visitor
- If it doesn't appear, create it manually and set permissions:
  ```bash
  mkdir data
  chmod 755 data
  ```

---

## 🔒 Security Notes

1. **Admin Dashboard:**
   - Change the default password in the JavaScript (search for `admin/admin`)
   - For production, use proper authentication

2. **Data Storage:**
   - Current version uses JSON files (simple, no database needed)
   - For high traffic (1000+ visitors/day), consider upgrading to MySQL

3. **API Protection:**
   - Add rate limiting if needed
   - Consider adding API keys for production

---

## 📊 Upgrading to MySQL (Optional)

If you expect high traffic, you can upgrade from JSON to MySQL:

1. **Create a MySQL database**
2. **Create tables:**
   ```sql
   CREATE TABLE visitors (
       id INT AUTO_INCREMENT PRIMARY KEY,
       ip VARCHAR(50),
       timestamp DATETIME,
       user_agent TEXT
   );
   
   CREATE TABLE emails (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE,
       coupon_code VARCHAR(50),
       timestamp DATETIME
   );
   ```

3. **Modify api.php** to use MySQL instead of JSON files

---

## ✅ Features Now Available

- ✅ **Real-time visitor tracking** across all devices
- ✅ **Email collection** with automatic coupon generation
- ✅ **Live dashboard** updates every 5 seconds
- ✅ **7-day visitor chart** with real data
- ✅ **Email subscriber list** in real-time
- ✅ **IP tracking** (for analytics)
- ✅ **No database required** (uses JSON files)
- ✅ **Easy to deploy** anywhere PHP runs

---

## 🆘 Need Help?

1. **Check the browser console (F12)** for error messages
2. **Test the API directly:** `/api.php?action=health`
3. **Verify PHP is working:** Create a test file `test.php` with:
   ```php
   <?php phpinfo(); ?>
   ```
   Then visit `/test.php`

---

## 🎉 You're All Set!

Your website now has:
- ✅ Real-time visitor tracking
- ✅ Email collection with coupons
- ✅ Live admin dashboard
- ✅ Works on all devices

Visit your website from different devices and watch the dashboard update in real-time! 🚀

