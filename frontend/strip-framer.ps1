$dir = "src\components\landing"
Get-ChildItem "$dir\*.jsx" | ForEach-Object {
    $file = $_.FullName
    $lines = Get-Content $file
    $newLines = @()
    foreach ($line in $lines) {
        # Skip framer-motion import lines
        if ($line -match 'from\s+"framer-motion"' -or $line -match "from\s+'framer-motion'") {
            Write-Host "  Removed import in $($_.Name)"
            continue
        }
        # Replace <motion.X with <X and </motion.X> with </X>
        $line = $line -replace '<motion\.', '<'
        $line = $line -replace '</motion\.', '</'
        # Remove framer-motion specific props
        $line = $line -replace '\s+variants=\{[^}]*\}', ''
        $line = $line -replace '\s+initial="hidden"', ''
        $line = $line -replace '\s+whileInView="visible"', ''
        $line = $line -replace '\s+viewport=\{[^}]*\}', ''
        $line = $line -replace '\s+whileHover=\{[^}]*\}', ''
        $line = $line -replace '\s+whileTap=\{[^}]*\}', ''
        $line = $line -replace '\s+initial=\{[^}]*\}', ''
        $line = $line -replace '\s+animate=\{[^}]*\}', ''
        $line = $line -replace '\s+exit=\{[^}]*\}', ''
        # Remove AnimatePresence tags
        $line = $line -replace '<AnimatePresence>', ''
        $line = $line -replace '</AnimatePresence>', ''
        $newLines += $line
    }
    Set-Content -Path $file -Value ($newLines -join "`n") -NoNewline
    Write-Host "Processed: $($_.Name)"
}
Write-Host "`nDone! All framer-motion references removed."
