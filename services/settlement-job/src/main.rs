fn settlement_total(values: &[u64]) -> u64 {
    values.iter().sum()
}

fn main() {
    let total = settlement_total(&[125, 375, 500]);
    println!("settled={total}");
}

#[cfg(test)]
mod tests {
    use super::settlement_total;

    #[test]
    fn totals_settlements() {
        assert_eq!(settlement_total(&[125, 375, 500]), 1_000);
    }
}
