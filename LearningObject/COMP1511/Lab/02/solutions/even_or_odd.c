#include <stdio.h>

int main(void) {
    int x;
    printf("Please enter a number: ");
    scanf("%d", &x);

    if (x < 0) {
        printf("NEGATIVE\n");
    } else if (x % 2 == 0) {
        printf("EVEN\n");
    } else {
        printf("ODD\n");
    }

    return 0;
}