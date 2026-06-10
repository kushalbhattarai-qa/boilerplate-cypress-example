Feature: Authentication

  Background:
    Given the login page is open

  Scenario: Admin signs in with valid credentials
    When I sign in with valid admin credentials
    Then I should be taken to the dashboard

  Scenario: User sees an error for an incorrect password
    When I sign in with the admin email and password "WrongPassword!"
    Then I should see the login error "Invalid email or password"

  Scenario: User sees validation when submitting empty credentials
    When I submit the login form without credentials
    Then I should see required login field validation
