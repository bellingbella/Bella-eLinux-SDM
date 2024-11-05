#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pwd.h>
#include <shadow.h>
#include <crypt.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

#define MAX_PASSWORD 100

int authenticate(const char *username, const char *password) {
    struct passwd *pw = getpwnam(username);
    if (pw == NULL) {
        printf("User not found!\n");
        return 0; // User not found
    }

    struct spwd *spw = getspnam(username);
    if (spw == NULL) {
        printf("Error fetching shadow password entry.\n");
        return 0; // Error fetching shadow entry
    }

    // Check the password
    char *encrypted_password = crypt(password, spw->sp_pwdp);
    if (strcmp(encrypted_password, spw->sp_pwdp) == 0) {
        return 1; // Authentication successful
    } else {
        printf("Invalid password!\n");
        return 0; // Invalid password
    }
}

int main(int argc, char *argv[]) {
    if (argc != 4) {
        printf("Usage: %s <username> <password> <path_to_script>\n", argv[0]);
        return EXIT_FAILURE;
    }

    const char *username = argv[1];
    const char *password = argv[2];
    const char *script_path = argv[3];

    if (authenticate(username, password)) {
        printf("Login successful!\n");

        struct passwd *pw = getpwnam(username);
        if (pw == NULL) {
            printf("Failed to get user info for %s\n", username);
            return EXIT_FAILURE;
        }

        // Set group ID and user ID
        if (setgid(pw->pw_gid) != 0) {
            perror("Failed to set group ID");
            return EXIT_FAILURE;
        }

        if (setuid(pw->pw_uid) != 0) {
            perror("Failed to set user ID");
            return EXIT_FAILURE;
        }

        // Fork a new process to execute the shell script
        pid_t pid = fork();
        if (pid < 0) {
            perror("Failed to fork");
            return EXIT_FAILURE;
        }

        if (pid == 0) {
            // In the child process, execute the shell script using execve
            char *args[] = {"/bin/bash", (char *)script_path, NULL}; // Using bash to execute the script
            char *envp[] = {NULL}; // Environment variables, if needed

            execve("/bin/bash", args, envp); // Executing with bash
            //perror("execve failed"); // Only reached if execve fails
            //return EXIT_FAILURE;
        } else {
            // In the parent process, you can wait for the child to finish
            int status;
            waitpid(pid, &status, 0);
            if (WIFEXITED(status)) {
                printf("Child exited with status %d\n", WEXITSTATUS(status));
            }
        }
    } else {
        printf("Login failed!\n");
        return EXIT_FAILURE;
    }
}
