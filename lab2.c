#include <stdio.h>
int main() {
    const int MAX_ELEMENTS = 8;
    float m[MAX_ELEMENTS];
    float prodPos = 1, sumBeforeMin = 0;
    int iMin = 0;

    for (int i = 0; i < MAX_ELEMENTS; i++) {
        printf("m[%d] = ", i);
        scanf("%f", &m[i]);
    }
    iMin = 0;
    for (int i = 0; i < MAX_ELEMENTS; i++) {
        if (m[i] > 0) prodPos *= m[i];
        if (m[i] < m[iMin]) iMin = i;
    }
    for (int i = 0; i < iMin; i++) {
        sumBeforeMin += m[i];
    }
    for (int i = 0; i < MAX_ELEMENTS; i += 2) {
        for (int j = i + 2; j < MAX_ELEMENTS; j += 2) {
            if (m[i] > m[j]) {
                float temp = m[i];
                m[i] = m[j];
                m[j] = temp;
            }
        }
    }
    for (int i = 1; i < MAX_ELEMENTS; i += 2) {
        for (int j = i + 2; j < MAX_ELEMENTS; j += 2) {
            if (m[i] > m[j]) {
                float temp = m[i];
                m[i] = m[j];
                m[j] = temp;
            }
        }
    }
    printf("\nПроизведение положительных элементов = %.2f\n", prodPos);
    printf("Сумма элементов до минимального = %.2f\n", sumBeforeMin);
    printf("Массив после сортировки четных и нечетных элементов:\n");
    for (int i = 0; i < MAX_ELEMENTS; i++) {
        printf("%.2f ", m[i]);
    }
    printf("\n");
    return 0;
}