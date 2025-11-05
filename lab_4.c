#include <stdio.h>
#include <stdbool.h>
#include <string.h>

struct Price {
    char TOVAR[50];
    char MAG[50];
    float STOIM;
};

int main() {
    const int MAX_EL = 8;
    struct Price SPISOK[MAX_EL];
    struct Price SP_TEMPOR;
    bool is = false;

    for (int i = 0; i < MAX_EL; i++) {
        printf("Введите запись № %d\n\tТовар: ", i);
        fgets(SPISOK[i].TOVAR, sizeof(SPISOK[i].TOVAR), stdin);
        SPISOK[i].TOVAR[strcspn(SPISOK[i].TOVAR, "\n")] = 0;

        printf("\tМагазин: ");
        fgets(SPISOK[i].MAG, sizeof(SPISOK[i].MAG), stdin);
        SPISOK[i].MAG[strcspn(SPISOK[i].MAG, "\n")] = 0;

        printf("Стоимость: ");
        scanf("%f", &SPISOK[i].STOIM);
        while(getchar() != '\n');
    }

    for(int i = 0; i < MAX_EL - 1; i++){
        for(int j = i + 1; j < MAX_EL; j++){
            if(strcmp(SPISOK[i].MAG, SPISOK[j].MAG) > 0){
                SP_TEMPOR = SPISOK[i];
                SPISOK[i] = SPISOK[j];
                SPISOK[j] = SP_TEMPOR;
            }
        }
    }

    char search_MAG[50];
    printf("\nВведите название магазина для поиска: ");
    fgets(search_MAG, sizeof(search_MAG), stdin);
    search_MAG[strcspn(search_MAG, "\n")] = 0;

    printf("\nТовары в магазине \"%s\":\n", search_MAG);
    for (int i = 0; i < MAX_EL; i++) {
        if (strcmp(SPISOK[i].MAG, search_MAG) == 0) {
            printf("Товар: %s | Цена: %.2f руб.\n", SPISOK[i].TOVAR, SPISOK[i].STOIM);
            is = true;
        }
    }

    if (!is){
        printf("Такого магазина нет в списке");
    }

    return 0;
}
