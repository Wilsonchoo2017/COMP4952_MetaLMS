#include <stdio.h>

int main(void) {
    int mark;

    printf("Please enter your mark: ");
    scanf("%d", &mark);

    if (mark < 0 || mark > 100) {
        printf("ERROR\n");
    } else if (mark < 50) {
        printf("FAIL\n");
    } else {
        printf("PASS\n");
    }

    return 0;
}
