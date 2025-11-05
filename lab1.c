#include <stdio.h>
#include <math.h>

int main() {
    double a, b, c;
    double xn, xk, dx;
    double x, F;

    printf("Введите:  a = "); 
    scanf("%lf", &a);                  //спецификатор формата ; оператор взятия адреса &
    printf("          b = "); 
    scanf("%lf", &b);
    printf("          c = "); 
    scanf("%lf", &c);
    printf("          X нач. = "); 
    scanf("%lf", &xn);
    printf("          X кон. = "); 
    scanf("%lf", &xk);
    printf("          dX = "); 
    scanf("%lf", &dx);

    printf("\nРезультат выполнения программы:\n");
//1e-6 используется для предотвращения ошибок округления при сравнении чисел с плавающей запятой.
    for (x = xn; x <= xk + 1e-6; x += dx) {
        if ((a + x < 0) && (b != 0)) {
            if (x > 0)
                F = a * log(x) - cos(x)/c;
            else
                F = 0;
        } else if ((a + x > 0) && (b == 0)) {
            if (x != b)
                F = sin((x - a)/(x - b));
            else
                F = 0;
        } else {
            F = exp(x) + (a + x*x)/c; // exp(x) вычисляет экспоненциальное значение для текущего значения x в цикле.
        }

        printf("x = %5.2f       F = %5.2f\n", x, F);
    }

    return 0;
}