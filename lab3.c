#include <stdio.h>

int main() {
    int matrix[3][5] = {
        {0, 1, 2, 14, 4},
        {0, 6, 7, 14, 9},
        {11, 12, 0, 14, 15}
    };
    int i, j;
// номер1 сколько строк с хотя бы одним нулем
    int rows_with_zero = 0;
    for (i=0; i<3; i++) {
        int has_zero = 0;
        for (j=0; j<5; j++) {
            if(matrix[i][j] == 0) {
                has_zero = 1;
                break;
            }
        }
        if (has_zero)
            rows_with_zero++;
    }
    printf("Число строк с хотя бы одним нулем: %d\n", rows_with_zero);

    // номер 2 столбец где самая длинная серия одинаковых элементов

    int max_same_el = 0;
    int column_with_max = 0;
    for (int j = 0; j<5; j++) {
        int current_lenght = 1;
        int longest_in_column = 1;
        for (int i = 1; i<3; i++) {
            if (matrix[i][j] == matrix[i-1][j]) {
                current_lenght++;
                if (current_lenght > longest_in_column)
                    longest_in_column = current_lenght;
            } else {
                current_lenght = 1;
            }
        }
        if (longest_in_column > max_same_el) {
            max_same_el = longest_in_column;
            column_with_max = j + 1; // +1 чтобы номер столбца был не с 0 а с 1
        }
    }
    printf("Номер столбца с самой длинной серией одинаковых элементов: %d\n", column_with_max);
    return 0;
}