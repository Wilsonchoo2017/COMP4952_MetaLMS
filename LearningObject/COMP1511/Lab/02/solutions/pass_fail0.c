#include <stdio.h>

int main(void) {
    int mark;

    printf("Please enter your mark: ");
    scanf("%d", &mark);

    if (mark < 0) {
        printf("ERROR\n");
    } else if (mark > 100) {
        printf("ERROR\n");
    } else if (mark >= 50) {
        printf("PASS\n");
    } else {
        printf("FAIL\n");
    }

    return 0;
}
