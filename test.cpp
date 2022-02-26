#include <iostream>
#include <chrono>

int main() {
    auto start = clock();
    auto end = clock();
    std::cout << end - start << std::endl;
    return 0;
}