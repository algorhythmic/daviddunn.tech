import { spawn } from 'child_process';

async function runScript(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Running ${scriptPath}...`);
    const process = spawn('npx', ['tsx', scriptPath], {
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} failed with code ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
    });
  });
}

async function seedAll() {
  try {
    // Seed MongoDB first
    await runScript('./scripts/seed-mongodb.ts');
    
    // Then seed Supabase
    await runScript('./scripts/seed-supabase.ts');
    
    console.log('All databases seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding databases:', error);
    process.exit(1);
  }
}

seedAll();
