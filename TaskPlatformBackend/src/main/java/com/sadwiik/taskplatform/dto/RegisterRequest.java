package com.sadwiik.taskplatform.dto;

public class RegisterRequest {

    private String email;
    private String password;
    private String role;
    private String adminSecret;

    public String getEmail()       { return email; }
    public void setEmail(String e) { this.email = e; }

    public String getPassword()       { return password; }
    public void setPassword(String p) { this.password = p; }

    public String getRole()       { return role; }
    public void setRole(String r) { this.role = r; }

    public String getAdminSecret()       { return adminSecret; }
    public void setAdminSecret(String s) { this.adminSecret = s; }
}
